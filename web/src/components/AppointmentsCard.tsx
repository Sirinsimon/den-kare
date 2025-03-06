import { Appointment } from "../pages/dashboard";

interface AppointmentsCardProps {
  appointments: Appointment[];
}

export default function AppointmentsCard({ appointments }: AppointmentsCardProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-medium mb-4">Today's Appointments</h2>
      <div className="border border-white/20 rounded-2xl flex-1">
        <div className="divide-y divide-white/10">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-4">
              <div className="flex justify-between items-center">
                <span>{appointment.patient}</span>
                <span className="text-sm text-white/70">{appointment.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

