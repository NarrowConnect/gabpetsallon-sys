
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Scissors, Home, Car, Droplets } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  nomeTutor: string;
  nomePet: string;
  dataServico: string;
  horaServico: string;
  servicoRealizar: string;
  status: "Agendado" | "Confirmado" | "Em andamento" | "Concluído" | "Cancelado";
  valor: number;
}

interface CalendarViewProps {
  appointments: Appointment[];
}

const CalendarView = ({ appointments }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const serviceIcons = {
    "Banho": Droplets,
    "Tosa": Scissors,
    "Banho e Tosa": Droplets,
    "Hospedagem": Home,
    "Pet Sitter": Home,
    "Taxi Dog": Car
  };

  const statusColors = {
    "Agendado": "bg-yellow-100 text-yellow-800",
    "Confirmado": "bg-green-100 text-green-800",
    "Em andamento": "bg-blue-100 text-blue-800",
    "Concluído": "bg-gray-100 text-gray-800",
    "Cancelado": "bg-red-100 text-red-800"
  };

  const workingHours = Array.from({ length: 8 }, (_, i) => i + 10); // 10h às 17h

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.dataServico === dateStr);
  };

  const getAppointmentsForHour = (date: Date, hour: number) => {
    const appointmentsForDate = getAppointmentsForDate(date);
    return appointmentsForDate.filter(apt => {
      const aptHour = parseInt(apt.horaServico.split(':')[0]);
      return aptHour === hour;
    });
  };

  const renderMonthView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          month={selectedDate}
          className="rounded-md border"
          modifiers={{
            hasAppointments: (date) => getAppointmentsForDate(date).length > 0
          }}
          modifiersStyles={{
            hasAppointments: { 
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              fontWeight: 'bold'
            }
          }}
        />
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">
            Agendamentos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h4>
          <div className="space-y-2">
            {getAppointmentsForDate(selectedDate).map((appointment) => {
              const ServiceIcon = serviceIcons[appointment.servicoRealizar as keyof typeof serviceIcons] || Clock;
              return (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <ServiceIcon className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{appointment.nomeTutor} - {appointment.nomePet}</p>
                      <p className="text-xs text-muted-foreground">{appointment.servicoRealizar}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{appointment.horaServico}</span>
                    <Badge className={`text-xs ${statusColors[appointment.status]}`}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {getAppointmentsForDate(selectedDate).length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum agendamento para este dia.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Semana de {format(weekStart, 'dd MMM', { locale: ptBR })} - {format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-2">
          <div className="font-semibold text-sm p-2">Horário</div>
          {weekDays.map(day => (
            <div key={day.toString()} className="font-semibold text-sm p-2 text-center">
              <div>{format(day, 'EEE', { locale: ptBR })}</div>
              <div className="text-xs text-muted-foreground">{format(day, 'dd/MM')}</div>
            </div>
          ))}
          
          {workingHours.map(hour => (
            <>
              <div key={`hour-${hour}`} className="text-sm p-2 border-r">
                {hour}:00
              </div>
              {weekDays.map(day => {
                const appointmentsForHour = getAppointmentsForHour(day, hour);
                return (
                  <div key={`${day}-${hour}`} className="min-h-[60px] p-1 border border-gray-100">
                    {appointmentsForHour.map(apt => (
                      <div key={apt.id} className="text-xs bg-blue-100 p-1 rounded mb-1 truncate">
                        <div className="font-medium">{apt.nomePet}</div>
                        <div className="text-gray-600">{apt.servicoRealizar}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {workingHours.map(hour => {
            const appointmentsForHour = getAppointmentsForHour(selectedDate, hour);
            return (
              <div key={hour} className="flex border rounded-lg">
                <div className="w-20 p-4 bg-gray-50 text-center font-medium">
                  {hour}:00
                </div>
                <div className="flex-1 p-4 min-h-[80px]">
                  {appointmentsForHour.length > 0 ? (
                    <div className="space-y-2">
                      {appointmentsForHour.map(appointment => {
                        const ServiceIcon = serviceIcons[appointment.servicoRealizar as keyof typeof serviceIcons] || Clock;
                        return (
                          <div key={appointment.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <ServiceIcon className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium">{appointment.nomeTutor} - {appointment.nomePet}</p>
                                <p className="text-sm text-muted-foreground">{appointment.servicoRealizar}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{appointment.horaServico}</span>
                              <Badge className={statusColors[appointment.status]}>
                                {appointment.status}
                              </Badge>
                              <span className="font-medium text-green-600">R$ {appointment.valor.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">Horário livre</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-purple-600" />
          Calendário de Agendamentos
        </CardTitle>
        <CardDescription>Visualize os agendamentos por mês, semana ou dia</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "month" | "week" | "day")}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="day">Dia</TabsTrigger>
          </TabsList>

          <TabsContent value="month">
            {renderMonthView()}
          </TabsContent>

          <TabsContent value="week">
            {renderWeekView()}
          </TabsContent>

          <TabsContent value="day">
            {renderDayView()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
