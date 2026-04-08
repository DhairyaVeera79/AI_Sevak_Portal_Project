import { ExpenseStatus, PrismaClient, RoleLevel, SevaMode, StoryStage } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { giId: 'ADMIN-DEMO' },
      update: { role: RoleLevel.ADMIN, displayName: 'Admin Demo' },
      create: {
        giId: 'ADMIN-DEMO',
        role: RoleLevel.ADMIN,
        displayName: 'Admin Demo',
      },
    }),
    prisma.user.upsert({
      where: { giId: 'C2-DEMO' },
      update: { role: RoleLevel.C2, displayName: 'Coordinator Demo' },
      create: {
        giId: 'C2-DEMO',
        role: RoleLevel.C2,
        displayName: 'Coordinator Demo',
      },
    }),
    prisma.user.upsert({
      where: { giId: 'C3-DEMO' },
      update: { role: RoleLevel.C3, displayName: 'Team Lead Demo' },
      create: {
        giId: 'C3-DEMO',
        role: RoleLevel.C3,
        displayName: 'Team Lead Demo',
      },
    }),
    prisma.user.upsert({
      where: { giId: 'C4-DEMO' },
      update: { role: RoleLevel.C4, displayName: 'Volunteer Demo' },
      create: {
        giId: 'C4-DEMO',
        role: RoleLevel.C4,
        displayName: 'Volunteer Demo',
      },
    }),
  ]);

  const userByGiId = Object.fromEntries(users.map((user) => [user.giId, user]));

  const sevaEducation = await prisma.seva.upsert({
    where: { code: 'SEVA-101' },
    update: {
      title: 'Education Support - Dharampur Batch',
      mode: SevaMode.OPEN,
      hoursPerWeek: 4,
      seatsTotal: 20,
      seatsLeft: 8,
      skillTagsJson: ['teaching', 'content', 'coordination'],
    },
    create: {
      code: 'SEVA-101',
      title: 'Education Support - Dharampur Batch',
      mode: SevaMode.OPEN,
      hoursPerWeek: 4,
      seatsTotal: 20,
      seatsLeft: 8,
      skillTagsJson: ['teaching', 'content', 'coordination'],
    },
  });

  const sevaHumanitarian = await prisma.seva.upsert({
    where: { code: 'SEVA-102' },
    update: {
      title: 'Humanitarian Care Logistics',
      mode: SevaMode.APPROVAL,
      hoursPerWeek: 6,
      seatsTotal: 12,
      seatsLeft: 3,
      skillTagsJson: ['operations', 'vendor-coordination'],
    },
    create: {
      code: 'SEVA-102',
      title: 'Humanitarian Care Logistics',
      mode: SevaMode.APPROVAL,
      hoursPerWeek: 6,
      seatsTotal: 12,
      seatsLeft: 3,
      skillTagsJson: ['operations', 'vendor-coordination'],
    },
  });

  await prisma.logEntry.upsert({
    where: { id: 'LOG-SEED-101' },
    update: {
      title: 'Learning Kit Distribution Completed',
      summary:
        'Volunteers completed doorstep distribution and captured attendance evidence for 75 students.',
      stage: StoryStage.MODERATION,
    },
    create: {
      id: 'LOG-SEED-101',
      sevaId: sevaEducation.id,
      userId: userByGiId['C4-DEMO'].id,
      title: 'Learning Kit Distribution Completed',
      summary:
        'Volunteers completed doorstep distribution and captured attendance evidence for 75 students.',
      stage: StoryStage.MODERATION,
    },
  });

  await prisma.logEntry.upsert({
    where: { id: 'LOG-SEED-102' },
    update: {
      title: 'Healthcare Camp Follow-up',
      summary:
        'Post-camp medicine follow-up calls completed with documented beneficiary response summaries.',
      stage: StoryStage.DRAFT,
    },
    create: {
      id: 'LOG-SEED-102',
      sevaId: sevaHumanitarian.id,
      userId: userByGiId['C3-DEMO'].id,
      title: 'Healthcare Camp Follow-up',
      summary:
        'Post-camp medicine follow-up calls completed with documented beneficiary response summaries.',
      stage: StoryStage.DRAFT,
    },
  });

  await prisma.expense.upsert({
    where: { id: 'EXP-SEED-101' },
    update: {
      category: 'Teaching supplies',
      amount: 3450,
      status: ExpenseStatus.REVIEWED,
    },
    create: {
      id: 'EXP-SEED-101',
      sevaId: sevaEducation.id,
      userId: userByGiId['C3-DEMO'].id,
      category: 'Teaching supplies',
      amount: 3450,
      status: ExpenseStatus.REVIEWED,
    },
  });

  await prisma.expense.upsert({
    where: { id: 'EXP-SEED-102' },
    update: {
      category: 'Travel reimbursement',
      amount: 1200,
      status: ExpenseStatus.SUBMITTED,
    },
    create: {
      id: 'EXP-SEED-102',
      sevaId: sevaHumanitarian.id,
      userId: userByGiId['C4-DEMO'].id,
      category: 'Travel reimbursement',
      amount: 1200,
      status: ExpenseStatus.SUBMITTED,
    },
  });

  await prisma.userSeva.upsert({
    where: {
      userId_sevaId: {
        userId: userByGiId['C4-DEMO'].id,
        sevaId: sevaEducation.id,
      },
    },
    update: {},
    create: {
      userId: userByGiId['C4-DEMO'].id,
      sevaId: sevaEducation.id,
    },
  });

  await prisma.userSeva.upsert({
    where: {
      userId_sevaId: {
        userId: userByGiId['C3-DEMO'].id,
        sevaId: sevaHumanitarian.id,
      },
    },
    update: {},
    create: {
      userId: userByGiId['C3-DEMO'].id,
      sevaId: sevaHumanitarian.id,
    },
  });

  console.log('Seed completed: users, sevas, logs, expenses initialized.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
