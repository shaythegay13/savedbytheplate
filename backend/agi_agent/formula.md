(Written by sabih on oct 12, for shay)

# Local development setup steps:
1. Clone the backend + frontend repo locally, or using github codespaces (only works with vscode). 
2. Get access to the supabase organzation, so you can deploy the serverless functions and see the logs. Then install supabase locally and login. Instructions in the frontend repo, line 39 section in `README.md`.
3. Keep in mind everytime you push to the backend reop, it redeploys the render fastapi deployment.
4. Start the backend + frontend repo. Keep in mind since the frontend repo uses supabase functions, it will fetch from the deployed backend on render. 
5. Make a garden plan from the local frontend (local backend doesn't have to run). And confirm you see the plan created. The problem with the plan is that it's always the same, regardless of what the user inputs.

# Steps to fix the issue:
1. Make a very simple formula for just how one of the questions would affect the recommendations. Don't do this based on location since it is hardcoded, can be fixed later, assume all are in NYC. Add this in plain english in the formula.md file (the current file).
2. Cleanup: create a folder "plant databases", move all plant files there, and update the imports referencing them throughout the project.
3. Write the most minimal amount of code to get this formula working.
4. One by one, expand and implement the formula for every other question that does not depend on location. Do the location dependant ones last since it deals with google maps, and is more complex.