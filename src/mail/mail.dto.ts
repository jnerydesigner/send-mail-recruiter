export type Replacement = [
  (
    | 'user'
    | 'company'
    | 'recruiter'
    | 'vacancy'
    | 'habilities'
    | 'saudation'
    | 'githubAvatar'
    | 'nameFull'
    | 'specialty'
    | 'availability'
    | 'curriculo'
  ),
  string,
][];

export type MailRequest = {
  to: string;
  company: string;
  vacancy: string;
  nameRecruiter: string;
  skills: string;
  specialty: string;
  githubAvatar: string;
  nameFull: string;
  pretention: string;
  availability: boolean;
  curriculo: string;
};
