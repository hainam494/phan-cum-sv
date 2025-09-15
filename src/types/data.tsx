export interface itemData{
    id: number;
    charMark: string;
    mark: number;
    markQT: number;
    isCounted: boolean;
    mark4: number;
    markTHI: number;
    subject: Subject;
}

export interface person{
    fullName: string;
    email: string;
    address: string;
    data: list[];
    gender: string;
    programming: number;
    presentation: number;
    reporting: number;
    research: number;
    scores?: avgScore;
}

interface avgScore{
    programming: number;
    presentation: number;
    reporting: number;
    research: number;
}

export interface list{
    displayName: string;
    children?: list[];
    listProgramSubject?: Subject[] | null;
}

export interface Subject{
    charMark: string | null;
    subjectMark: number | null;
    displaySubjectName: string;
}

export interface Option {
    value: number;
    label: string;
}
  
export interface SelectedValues {
    programming: number | null;
    presentation: number | null;
    reporting: number | null;
    research: number | null;
}

export interface Member {
    msv: string;
    name: string;
    gender: string;
    programming: number;
    presentation: number;
    reporting: number;
    research: number;
    score?: number;
}
  
export interface Group {
    id: number;
    name: string;
    topic: string;
    members: Member[];
    averageScore?: number;
}