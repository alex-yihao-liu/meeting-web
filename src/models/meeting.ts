export interface Meeting {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
    participants: string[];
}