import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config"; // Carrega as variáveis do .env
import { skills, skillsUser } from "./skills";

// Cria o adapter com a mesma lógica do PrismaService
const url = process.env.DATABASE_URL;

if (!url) {
    throw new Error("DATABASE_URL não está definida no .env");
}

const adapter = new PrismaBetterSqlite3({ url });

// Instancia o PrismaClient passando o adapter
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Starting database seed...");

    await prisma.$transaction(async (tx) => {
        // Limpa as tabelas na ordem correta (devido às foreign keys)
        await tx.userSkills.deleteMany();
        await tx.skills.deleteMany();
        await tx.user.deleteMany();



        const skillsCreated = await Promise.all(
            skills.map((name) => tx.skills.create({ data: { name } }))
        );

        const user = await tx.user.create({
            data: {
                email: "jander.webmaster@gmail.com",
                name: "Jander Nery",
                curriculoUrl: "https://github.com/jnerydesigner.png", // corrigido: era githubAvatar duplicado
                specialty: "Full Stack Developer",
                githubAvatar: "https://github.com/jnerydesigner.png",
            },
        });

        console.log(`Usuário criado: ${user.name} (${user.email})`);
        console.log(`${skills.length} habilidades associadas.`);

        const userSkills = await Promise.all(
            skillsUser.map((skillName) => tx.userSkills.create({
                data: {
                    userId: user.id,
                    skillId: skillsCreated.find((skill) => skill.name === skillName)?.id,
                },
            }))
        );

        console.log(`${userSkills.length} habilidades associadas ao usuário.`);
    });

    console.log("✅ Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("Erro durante o seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });