import type { Route } from './+types/_index';

export default function Home({
  loaderData,
  actionData,
  params,
  matches,
}: Route.ComponentProps) {
  console.log(loaderData, actionData, params, matches);
  return <div>Home</div>;
}
