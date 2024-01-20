import { Shell } from "@notebook/ui/components";
import { PerPageForm } from "./_components/perPageForm";
import { CompleteDocForm } from "./_components/completeDocForm";

export default function IndexPage() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV) {
    return <div>Dashboard is not accessible in production yet.</div>;
  }

  return (
    <Shell className="flex flex-wrap ">
      <CompleteDocForm></CompleteDocForm>
      <PerPageForm></PerPageForm>
    </Shell>
  );
}
