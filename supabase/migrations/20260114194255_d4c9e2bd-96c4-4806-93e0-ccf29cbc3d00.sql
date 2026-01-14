-- Step 1: Create a function to merge duplicate locations
-- This keeps the record with the most complete data and merges info from others

CREATE OR REPLACE FUNCTION public.deduplicate_locations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    dup_record RECORD;
    keeper_id UUID;
    other_ids UUID[];
BEGIN
    -- Find all duplicate groups (same name within ~100m)
    FOR dup_record IN 
        WITH duplicate_groups AS (
            SELECT 
                name,
                ROUND(latitude::numeric, 3) as lat_rounded,
                ROUND(longitude::numeric, 3) as lng_rounded,
                array_agg(id ORDER BY 
                    -- Prioritize records with more complete data
                    (CASE WHEN description IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN address IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN organization IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN phone IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN email IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN website IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN hours IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN open_hours IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN cross_streets IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN neighborhood IS NOT NULL THEN 1 ELSE 0 END)
                    DESC
                ) as ids
            FROM locations
            GROUP BY name, ROUND(latitude::numeric, 3), ROUND(longitude::numeric, 3)
            HAVING COUNT(*) > 1
        )
        SELECT * FROM duplicate_groups
    LOOP
        -- First ID is the keeper (most complete), rest are duplicates
        keeper_id := dup_record.ids[1];
        other_ids := dup_record.ids[2:array_length(dup_record.ids, 1)];
        
        -- Merge data from duplicates into keeper (only if keeper field is null)
        UPDATE locations l SET
            description = COALESCE(l.description, (SELECT description FROM locations WHERE id = ANY(other_ids) AND description IS NOT NULL LIMIT 1)),
            address = COALESCE(l.address, (SELECT address FROM locations WHERE id = ANY(other_ids) AND address IS NOT NULL LIMIT 1)),
            organization = COALESCE(l.organization, (SELECT organization FROM locations WHERE id = ANY(other_ids) AND organization IS NOT NULL LIMIT 1)),
            phone = COALESCE(l.phone, (SELECT phone FROM locations WHERE id = ANY(other_ids) AND phone IS NOT NULL LIMIT 1)),
            email = COALESCE(l.email, (SELECT email FROM locations WHERE id = ANY(other_ids) AND email IS NOT NULL LIMIT 1)),
            website = COALESCE(l.website, (SELECT website FROM locations WHERE id = ANY(other_ids) AND website IS NOT NULL LIMIT 1)),
            hours = COALESCE(l.hours, (SELECT hours FROM locations WHERE id = ANY(other_ids) AND hours IS NOT NULL LIMIT 1)),
            open_hours = COALESCE(l.open_hours, (SELECT open_hours FROM locations WHERE id = ANY(other_ids) AND open_hours IS NOT NULL LIMIT 1)),
            cross_streets = COALESCE(l.cross_streets, (SELECT cross_streets FROM locations WHERE id = ANY(other_ids) AND cross_streets IS NOT NULL LIMIT 1)),
            neighborhood = COALESCE(l.neighborhood, (SELECT neighborhood FROM locations WHERE id = ANY(other_ids) AND neighborhood IS NOT NULL LIMIT 1)),
            borough = COALESCE(l.borough, (SELECT borough FROM locations WHERE id = ANY(other_ids) AND borough IS NOT NULL LIMIT 1)),
            zip_code = COALESCE(l.zip_code, (SELECT zip_code FROM locations WHERE id = ANY(other_ids) AND zip_code IS NOT NULL LIMIT 1)),
            details = COALESCE(l.details, (SELECT details FROM locations WHERE id = ANY(other_ids) AND details IS NOT NULL LIMIT 1)),
            contact_information = COALESCE(l.contact_information, (SELECT contact_information FROM locations WHERE id = ANY(other_ids) AND contact_information IS NOT NULL LIMIT 1)),
            -- Merge sources so we know where data came from
            source = l.source || ',' || (SELECT string_agg(DISTINCT source, ',') FROM locations WHERE id = ANY(other_ids) AND source IS NOT NULL),
            updated_at = now()
        WHERE l.id = keeper_id;
        
        -- Delete the duplicates
        DELETE FROM locations WHERE id = ANY(other_ids);
    END LOOP;
END;
$$;

-- Step 2: Run the deduplication
SELECT public.deduplicate_locations();

-- Step 3: Verify results
-- DROP FUNCTION public.deduplicate_locations();