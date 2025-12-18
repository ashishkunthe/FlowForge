import { Request, Response, Router } from "express";
import { ideaSchema } from "../Types/userType";
import { Idea } from "../modules/Idea";
import { authMiddleware } from "../middleware/authMiddleware";
import { generatePlan } from "../services/generatePlan";
import { Plan } from "../modules/Plan";

const route = Router();

interface RequestExtended extends Request {
  userId: string;
}

route.post(
  "/create",
  authMiddleware as any,
  async (req: Request, res: Response) => {
    const data = ideaSchema.safeParse(req.body);
    const request = req as RequestExtended;

    if (!data.success) {
      res.json({
        message: "Invalid inputs",
      });
      return;
    }
    try {
      const { title, mainIdea, howToAchieve, motivation } = data.data;
      const userId = request.userId;

      const idea = await Idea.create({
        title,
        mainIdea,
        howToAchieve,
        motivation,
        userId,
      });

      res.json({
        message: "Idea created",
      });
    } catch (error) {
      console.log("error in creating idea");
      res.json({
        message: "internal server error",
      });
    }
  }
);

route.get(
  "/all",
  authMiddleware as any,
  async (req: Request, res: Response) => {
    const request = req as RequestExtended;

    try {
      const userId = request.userId;
      const ideas = await Idea.find({ userId });

      if (ideas.length == 0) {
        res.json({
          message: "no ideas added yet",
        });
        return;
      }

      res.json({
        message: "all the ideas",
        ideas: ideas,
      });
    } catch (error) {
      console.log("error getting the ideas");
      res.json({
        message: "internal server error",
      });
    }
  }
);

route.get(
  "/:id",
  authMiddleware as any,
  async (req: Request, res: Response) => {
    const request = req as RequestExtended;

    try {
      const userId = request.userId;
      const id = req.params.id;

      if (!id || !userId) {
        return res.json({
          message: "pls make sure you're passing the id ",
        });
      }

      const idea = await Idea.findOne({ _id: id, userId });

      if (!idea) {
        res.json({
          message: "the idea not found",
        });
        return;
      }
      const plan = await Plan.findOne({ ideaId: id, userId });

      if (!plan) {
        return res.json({
          message: "no plan generated yet for this idea",
        });
      }

      res.json({
        message: "get idea successfull",
        idea: idea,
        plan: plan ?? null,
      });
    } catch (error) {
      console.log("error is getting idea", error);
      res.json({
        message: "internal server error",
      });
    }
  }
);

route.post(
  "/assist/:id",
  authMiddleware as any,
  async (req: Request, res: Response) => {
    const request = req as RequestExtended;

    try {
      const userId = request.userId;
      const id = request.params.id;

      const findIdea = await Idea.findById(id);

      if (!findIdea) {
        return res.json({
          message: "idea not found",
        });
      }

      if (findIdea.userId.toString() !== userId) {
        return res.json({
          message: "access denied",
        });
      }

      const { title, mainIdea, motivation, howToAchieve } = findIdea;

      const plan = await generatePlan({
        title,
        mainIdea,
        motivation: motivation ?? "",
        howToAchieve: howToAchieve ?? "",
      });

      await Plan.create({
        ideaId: findIdea._id,
        userId: request.userId,
        summary: plan.summary,
        roadmap: plan.roadmap,
        challenges: plan.challenges,
        improvements: plan.improvements,
        nextSteps: plan.nextSteps,
      });

      res.json({
        messgae: "plan generated",
        plan: plan,
      });
    } catch (error) {
      console.log("error in getting assistance", error);
      res.json({
        message: "internal server error",
      });
    }
  }
);

export default route;
