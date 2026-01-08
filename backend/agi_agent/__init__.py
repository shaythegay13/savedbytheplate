"""
AGI Agent - A framework for building agentic AI systems.
"""

__version__ = "0.1.0"

from .core.agent import AGIAgent
from .cli import main

__all__ = ['AGIAgent', 'main']
