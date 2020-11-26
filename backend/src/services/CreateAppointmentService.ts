import { startOfHour } from "date-fns";
import { userInfo } from "os";
import {getCustomRepository} from "typeorm"
import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import AppError from "../errors/AppError";
interface RequestDTO{
    provider_id:string;
    date:Date;
}

class CreateAppointmentService{
    private appointmentsRepository:AppointmentsRepository;

    constructor(appointmentsRepository:AppointmentsRepository){
        this.appointmentsRepository = appointmentsRepository;
    }

     public async execute({provider_id,date}:RequestDTO):Promise<Appointment>{
        const appointmentDate = startOfHour(date)
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate)

        if(findAppointmentInSameDate){
            throw new AppError("This appointment id already booked",400)
           }

        const appointment = appointmentsRepository.create({
            provider_id,
            date:appointmentDate
        });

        await appointmentsRepository.save(appointment);
        return appointment;

    }
}

export default CreateAppointmentService;
