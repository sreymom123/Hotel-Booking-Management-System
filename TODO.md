- [ ] Inspect current DB and repository code
- [ ] Fix `backend/src/config/db.ts`: remove Sequelize usage; implement `connectDatabase()` + `getDatabaseStatus()` using Prisma
- [ ] Fix `backend/src/repositories/PaymentRepository.ts`: remove Sequelize usage; use Prisma `$queryRaw`/`$executeRaw` instead
- [ ] Run backend (`npm run dev`) and verify URLs: `/api/health`, `/api/checkin`, `/api/checkout`
- [ ] Confirm payment endpoints work with MySQL

