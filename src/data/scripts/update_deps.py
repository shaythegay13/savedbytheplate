#!/usr/bin/env python3
"""
Script to update dependencies using pip-tools.
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(cmd: list[str], cwd: str | Path) -> None:
    """Run a command in the specified directory."""
    try:
        subprocess.run(cmd, cwd=cwd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running command {' '.join(cmd)}: {e}")
        sys.exit(1)

def update_dependencies() -> None:
    """Update all dependencies using pip-tools."""
    # Get the root directory (where requirements/ is)
    root_dir = Path(__file__).parent.parent
    req_dir = root_dir / "requirements"

    # Ensure requirements directory exists
    os.makedirs(req_dir, exist_ok=True)

    # Update base requirements first
    print("Updating base requirements...")
    run_command(
        ["pip-compile", "--upgrade", "--output-file=base.txt", "base.in"],
        cwd=req_dir
    )

    # Update development requirements
    print("Updating development requirements...")
    run_command(
        ["pip-compile", "--upgrade", "--output-file=dev.txt", "dev.in"],
        cwd=req_dir
    )

    # Sync the current environment with dev requirements
    print("Syncing virtual environment...")
    run_command(
        ["pip-sync", "dev.txt"],
        cwd=req_dir
    )

    print("Dependencies updated successfully!")

if __name__ == "__main__":
    update_dependencies()