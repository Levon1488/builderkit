import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { tools } from "@/lib/tools";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, active")
    .eq("user_id", user!.id)
    .single();

  const toolId = typeof searchParams?.tool === "string" ? searchParams.tool : undefined;
  const activeTool = tools.find((t) => t.id === toolId);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nástroje</h1>
        <div className="text-lg font-medium">
          Tvé kredity: {profile?.credits ?? 0}
        </div>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={{ pathname: "/dashboard", query: { tool: tool.id } }}
              className="block rounded-lg border p-4 hover:shadow-md bg-card"
            >
              <div className="font-semibold">{tool.name}</div>
              <div className="text-sm text-muted-foreground">{tool.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="text-sm text-muted-foreground">
          {activeTool
            ? `Aktivní: ${activeTool.name}`
            : "Vyber nástroj pro zobrazení."}
        </div>
        {activeTool && (
          <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border">
            <iframe
              title={activeTool.name}
              src={activeTool.url}
              className="w-full h-full"
            />
          </div>
        )}
      </section>
    </div>
  );
}
