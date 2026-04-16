import { prisma } from '@/lib/prisma'

async function main() {
  console.log('Running seed script...')

  // Usuario activo
  await prisma.user.upsert({
    where: { email: 'active@example.com' },
    update: {},
    create: {
      email: 'active@example.com',
      full_name: 'Usuario Activo',
      password: 'changeme',
      is_disabled: false,
    }
  })

  // Usuario deshabilitado
  await prisma.user.upsert({
    where: { email: 'disabled@example.com' },
    update: {},
    create: {
      email: 'disabled@example.com',
      full_name: 'Usuario Deshabilitado',
      password: 'changeme',
      is_disabled: true,
    }
  })

  // Crear curso y un nodo con una pregunta y respuestas si no existen
  const coursesCount = await prisma.course.count();
  if (coursesCount === 0) {
    const course = await prisma.course.create({ data: { name: 'Curso Demo', color_theme: '#0ea5a4' } });

    const node = await prisma.roadmapNode.create({ data: { courseId: course.id, title: 'Nodo Introductorio', order_index: 1 } });

    const question = await prisma.question.create({ data: { nodeId: node.id, question_text: '¿Cuál es la capital del Perú?' } });

    await prisma.answer.createMany({ data: [
      { questionId: question.id, answer_text: 'Lima', is_correct: true },
      { questionId: question.id, answer_text: 'Cusco', is_correct: false }
    ] });
  }

  console.log('Seed finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

