import { Card } from "./ui/card";
import { Progress } from "@/components/ui/progress";

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Sales Lead",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0a2540&color=fff",
    mobility: 80,
    ffh: 65,
    shs: 90,
  },
  {
    name: "Jamie Lee",
    role: "Account Manager",
    avatar: "https://ui-avatars.com/api/?name=Jamie+Lee&background=0a2540&color=fff",
    mobility: 55,
    ffh: 75,
    shs: 60,
  },
  {
    name: "Morgan Smith",
    role: "Field Rep",
    avatar: "https://ui-avatars.com/api/?name=Morgan+Smith&background=0a2540&color=fff",
    mobility: 95,
    ffh: 80,
    shs: 70,
  },
];

export default function TeamResults() {
  return (
    <section className="w-full max-w-2xl mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center tracking-tight">Team Progress</h2>
      <div className="flex flex-col gap-6">
        {teamMembers.map((member) => (
          <Card key={member.name} className="flex flex-col md:flex-row items-center gap-6 p-6 shadow-md">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 rounded-full border-2 border-primary object-cover"
            />
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div>
                  <div className="font-semibold text-lg">{member.name}</div>
                  <div className="text-muted-foreground text-sm">{member.role}</div>
                </div>
              </div>
              <div className="space-y-3 mt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mobility Sales</span>
                    <span className="font-medium">{member.mobility}%</span>
                  </div>
                  <Progress value={member.mobility} className="h-3 bg-muted" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>FFH Sales</span>
                    <span className="font-medium">{member.ffh}%</span>
                  </div>
                  <Progress value={member.ffh} className="h-3 bg-muted" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>SHS Sales</span>
                    <span className="font-medium">{member.shs}%</span>
                  </div>
                  <Progress value={member.shs} className="h-3 bg-muted" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
} 