import { Request, Response, Router } from "express";
import { ideaSchema } from "../Types/userType";
import { Idea } from "../modules/Idea";
import { authMiddleware } from "../middleware/authMiddleware";

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

      const idea = await Idea.findOne({ _id: id, userId });

      if (!idea) {
        res.json({
          message: "the idea not found",
        });
        return;
      }

      res.json({
        message: "get idea successfull",
        idea: idea,
      });
    } catch (error) {
      console.log("error is getting idea", error);
      res.json({
        message: "internal server error",
      });
    }
  }
);

export default route;
