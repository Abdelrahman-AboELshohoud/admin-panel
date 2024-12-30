import { StarIcon } from "lucide-react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import moment from "moment";
import { useState, useEffect } from "react";
import { Driver, DriverFeedbacksGQL, Feedback } from "../../graphql/requests";

export default function Feedbacks({ profile }: { profile: Driver }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const getFeedbacks = async () => {
    const res = await DriverFeedbacksGQL({
      id: profile?.id,
    });
    setFeedbacks(res.data.feedbacks.nodes);
  };
  useEffect(() => {
    getFeedbacks();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-100">
        {feedbacks.length > 0
          ? feedbacks.length + " Feedbacks"
          : "No feedbacks currently"}
      </h1>
      <div className="flex flex-col gap-4">
        {feedbacks &&
          feedbacks.length > 0 &&
          feedbacks.map((feedback: Feedback) => (
            <Card className="card-shape flex flex-col gap-2">
              <CardHeader className="py-2">
                <CardTitle className="flex flex-row text-yellow-500 gap-2 font-semibold text-xl">
                  <div className="font-medium">{feedback.score}</div>
                  <StarIcon className="w-6 h-6" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {feedback.description}
                </CardDescription>
              </CardContent>

              <div className="text-sm font-medium ml-auto w-fit bg-gray-900 text-gray-100 rounded-md px-2 py-1">
                {moment(feedback.reviewTimestamp).format("DD MMM YYYY")}
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
