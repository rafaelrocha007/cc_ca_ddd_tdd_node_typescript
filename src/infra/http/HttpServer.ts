import express, { application } from "express";
import EnrollmentController from "../../adapter/controller/EnrollmentController";
import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";

export default class HttpServer {
  private constructor() {}

  static start(repositoryFactory: RepositoryAbstractFactory) {
    const app = express();

    application.use(express.json());

    app.post("/enrollments", async function (req, res) {
      const controller = new EnrollmentController(repositoryFactory);
      try {
        const enrollStudentOutputData = await controller.enrollStudent(
          req.body
        );
        res.json(enrollStudentOutputData);
      } catch (e: any) {
        res.status(422);
        res.json({ message: e.message });
      }
    });

    app.get("/enrollments/:code", async function (req, res) {
      const controller = new EnrollmentController(repositoryFactory);
      try {
        const getEnrollmentOutputData = await controller.getEnrollment(
          req.params.code
        );
        res.json(getEnrollmentOutputData);
      } catch (e: any) {
        res.status(422);
        res.json({ message: e.message });
      }
    });

    app.post("/enrollments/:code/payments", async function (req: any, res) {
      const controller = new EnrollmentController(repositoryFactory);
      try {
        await controller.payInvoice(
          req.params.code,
          req.params.month,
          req.params.year,
          req.params.amount,
          req.params.paymentDate
        );
        res.status(204);
        res.json("");
      } catch (e: any) {
        res.status(422);
        res.json({ message: e.message });
      }
    });

    app.post("/enrollments/:code/cancel", async function (req, res) {
      const controller = new EnrollmentController(repositoryFactory);
      try {
        await controller.cancelEnrollment(req.params.code);
        res.status(204);
        res.json("");
      } catch (e: any) {
        res.status(422);
        res.json({ message: e.message });
      }
    });

    app.listen(3000);
  }
}
