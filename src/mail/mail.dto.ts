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
};
