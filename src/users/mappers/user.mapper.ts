export class UserMapper {
    static toResponse(user: any): UserOutput {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            curriculoUrl: user.curriculoUrl,
            githubAvatar: user.githubAvatar,
            specialty: user.specialty,
            skills: user.skills.map((skill: any) => skill.skill.name),
        }
    }
}


export type UserOutput = {
    id: string;
    name: string;
    email: string;
    curriculoUrl: string;
    githubAvatar: string;
    specialty: string;
    skills: string[]
}