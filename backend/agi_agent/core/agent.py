from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import json
import time

@dataclass
class Memory:
    """Represents a memory unit for the AGI."""
    content: str
    metadata: Dict[str, Any]
    timestamp: float
    importance: float  # 0.0 to 1.0

class AGIAgent:
    def __init__(self, name: str, model_name: str = "gpt-4"):
        self.name = name
        self.model_name = model_name
        self.memory: List[Memory] = []
        self.skills = {}
        
    def perceive(self, observation: str) -> None:
        """Process and store a new observation."""
        memory = Memory(
            content=observation,
            metadata={"type": "observation"},
            timestamp=time.time(),
            importance=0.5  # Default importance
        )
        self.memory.append(memory)
        
    def think(self, query: str) -> str:
        """Process the query and generate a response."""
        # Retrieve relevant memories
        context = self._retrieve_relevant_memories(query)
        
        # Generate response using the language model
        response = self._generate_response(query, context)
        
        # Store the interaction in memory
        self._store_interaction(query, response)
        
        return response
    
    def _retrieve_relevant_memories(self, query: str, top_k: int = 5) -> List[Memory]:
        """Retrieve the most relevant memories for the given query."""
        # Simple implementation - can be enhanced with vector similarity
        # For now, return the most recent memories
        return sorted(self.memory, key=lambda x: x.timestamp, reverse=True)[:top_k]
    
    def _generate_response(self, query: str, context: List[Memory]) -> str:
        """Generate a response using the language model."""
        # This is a placeholder - in a real implementation, you would use an LLM API
        context_str = "\n".join([f"- {mem.content}" for mem in context])
        return f"Based on my knowledge: {query}. Context: {context_str}"
    
    def _store_interaction(self, query: str, response: str) -> None:
        """Store the interaction in memory."""
        interaction = Memory(
            content=f"Q: {query}\nA: {response}",
            metadata={"type": "interaction"},
            timestamp=time.time(),
            importance=0.7
        )
        self.memory.append(interaction)
        
    def add_skill(self, name: str, function: callable) -> None:
        """Add a new skill/function to the agent's capabilities."""
        self.skills[name] = function
        
    def __str__(self) -> str:
        return f"AGIAgent(name='{self.name}', memories={len(self.memory)}, skills={len(self.skills)})"
