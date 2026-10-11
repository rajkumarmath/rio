from pydantic import BaseModel
from typing import List, Optional

class CommitteeMember(BaseModel):
    name: str
    role: str

class Initiative(BaseModel):
    title: str
    description: str

class AssociationInfo(BaseModel):
    mission: str
    overview: str
    contact_email: str
    contact_phone: str
    address: str
    committee_members: List[CommitteeMember]
    initiatives: List[Initiative]
