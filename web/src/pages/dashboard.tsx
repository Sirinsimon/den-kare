import DashboardLayout from "../components/DashboardLayout"
import AppointmentsCard from "../components/AppointmentsCard"
import DoctorsCard from "../components/DoctorsCard"
import DutyCard from "../components/DutyCard"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"

// Types for our data
export type Appointment = {
    id: number
    patient: string
    clinicId: string
    doctorId: string
    time: string
    type: string
}

export type Doctor = {
    id: number
    name: string
    specialty: string
    status: string
}

export type DutyStatus = {
    initialStatus: boolean
    activeSince: string
}

export default function Dashboard() {

    const [appointments, setAppointments] = useState<Appointment[]>([])

    // Sample doctors data
    const doctors: Doctor[] = [
        { id: 1, name: "Dr. James Wilson", specialty: "Cardiology", status: "Available" },
        { id: 2, name: "Dr. Lisa Chen", specialty: "Neurology", status: "In Surgery" },
        { id: 3, name: "Dr. Mark Taylor", specialty: "Pediatrics", status: "Available" },
        { id: 4, name: "Dr. Anna Garcia", specialty: "Oncology", status: "With Patient" },
        { id: 5, name: "Dr. David Kim", specialty: "Orthopedics", status: "Available" },
    ]

    // Duty status data
    const dutyStatus: DutyStatus = {
        initialStatus: true,
        activeSince: "7Hrs",
    }

    // User data for navbar
    const user = {
        name: "Dr. Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
    }

    const fetchAppointements = async () => {
        let data = await fetch("http://localhost:8000/doctor/appointments")
        let res = await data.json()
        console.log(res)
        setAppointments(res)
    }


    useEffect(() => {
        fetchAppointements()
    }, [])

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <Navbar user={user} />
            <DashboardLayout>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AppointmentsCard appointments={appointments} />
                    <DoctorsCard doctors={doctors} />
                </div>
                <div className="mt-6">
                    <DutyCard dutyStatus={dutyStatus} />
                </div>
            </DashboardLayout>
        </div>
    )
}


