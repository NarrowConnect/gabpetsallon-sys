import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Scissors,
  Home,
  Car,
  Droplets,
  Stethoscope,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  nomeTutor: string;
  nomePet: string;
  dataServico: string; // formato 'yyyy-MM-dd'
  horaServico: string; // formato 'HH:mm'
  servicoRealizar: string;
  status: "Agendado" | "Confirmado" | "Em andamento" | "Concluído" | "Cancelado";
  valor: number;
  origem?: string;
}

interface CalendarViewProps {
  appointments: Appointment[];
}

const CalendarView = ({ appointments }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Ícones para serviços
  const serviceIcons = {
    Banho: Droplets,
    Tosa: Scissors,
    "Banho e Tosa": Droplets,
    "Banho Medicamentoso": Stethoscope,
    Hospedagem: Home,
    "Pet Sitter": Home,
    "Taxi Dog": Car,
  };

  // Cores de status
  const statusColors = {
    Agendado: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Confirmado: "bg-green-100 text-green-800 border-green-300",
    "Em andamento": "bg-blue-100 text-blue-800 border-blue-300",
    Concluído: "bg-gray-100 text-gray-800 border-gray-300",
    Cancelado: "bg-red-100 text-red-800 border-red-300",
  };

  // Horários de atendimento: 8h às 17h (10 horas)
  const workingHours = Array.from({ length: 10 }, (_, i) => i + 8);

  // Filtra agendamentos por data
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.filter((apt) => apt.dataServico === dateStr);
  };

  // Filtra agendamentos por data e hora
  const getAppointmentsForHour = (date: Date, hour: number) => {
    const appointmentsForDate = getAppointmentsForDate(date);
    return appointmentsForDate.filter((apt) => {
      const aptHour = parseInt(apt.horaServico.split(":")[0]);
      return aptHour === hour;
    });
  };

  // Render view mensal
  const renderMonthView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-brand-cyan/20">
          <h3 className="text-lg font-semibold text-brand-cyan">
            {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
              className="border border-brand-cyan hover:bg-brand-cyan hover:text-white bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
              className="border border-brand-orange hover:bg-brand-orange hover:text-white px-4 bg-transparent"
            >
              Hoje
            </Button>
            <Button
              onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
              className="border border-brand-cyan hover:bg-brand-cyan hover:text-white bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Calendar
          mode="single"
          onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
          month={selectedDate}
          modifiers={{
            hasAppointments: (date: Date) => getAppointmentsForDate(date).length > 0,
          }}
          modifiersStyles={{
            hasAppointments: {
              backgroundColor: "hsl(var(--brand-cyan) / 0.2)",
              color: "hsl(var(--brand-cyan))",
              fontWeight: "bold",
            },
          }}
        />

        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-brand-cyan">
            Agendamentos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h4>
          {getAppointmentsForDate(selectedDate).length === 0 && (
            <p className="text-muted-foreground">Nenhum agendamento para este dia.</p>
          )}
          {getAppointmentsForDate(selectedDate).map((appointment) => {
            const ServiceIcon =
              serviceIcons[appointment.servicoRealizar as keyof typeof serviceIcons] || Clock;
            return (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-brand-cyan/10 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <ServiceIcon className="h-4 w-4 text-brand-orange" />
                  <div>
                    <p className="font-medium text-sm">
                      {appointment.nomeTutor} - {appointment.nomePet}
                    </p>
                    {appointment.origem && (
                      <Badge className="text-xs mt-1 border border-gray-300 bg-transparent">
                        {appointment.origem === "tutores"
                          ? "Solicitação Tutor"
                          : "Agendamento Admin"}
                      </Badge>
                    )}
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
        </div>
      </div>
    );
  };

  // Render view semanal
  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-brand-cyan/20">
          <h3 className="text-lg font-semibold text-brand-cyan">
            Semana de {format(weekStart, "dd MMM", { locale: ptBR })} -{" "}
            {format(weekEnd, "dd MMM yyyy", { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              className="border border-brand-cyan hover:bg-brand-cyan hover:text-white bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setSelectedDate(new Date())}
              className="border border-brand-orange hover:bg-brand-orange hover:text-white px-4"
            >
              Hoje
            </Button>
            <Button
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="border border-brand-cyan hover:bg-brand-cyan hover:text-white bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-8 border border-gray-300 rounded-lg overflow-hidden">
          {/* Cabeçalho: primeira célula vazia + dias da semana */}
          <div className="border-r border-gray-300 bg-gray-50 p-2 font-semibold text-center">Hora</div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="border-r border-gray-300 bg-gray-50 p-2 font-semibold text-center"
            >
              <div>{format(day, "EEE", { locale: ptBR })}</div>
              <div className="text-xs text-muted-foreground">{format(day, "dd/MM")}</div>
            </div>
          ))}

          {/* Linhas de horário */}
          {workingHours.map((hour) => (
            <React.Fragment key={`hour-${hour}`}>
              {/* Coluna da hora */}
              <div className="border-t border-r border-gray-300 bg-gray-50 p-2 text-sm text-center font-medium">
                {hour}:00
              </div>

              {/* Colunas dos dias */}
              {weekDays.map((day) => {
                const appointmentsForHour = getAppointmentsForHour(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="border-t border-r border-gray-300 min-h-[60px] p-1"
                  >
                    {appointmentsForHour.length > 0 ? (
                      appointmentsForHour.map((apt) => (
                        <div
                          key={apt.id}
                          className="text-xs bg-brand-cyan/20 text-brand-cyan p-1 rounded mb-1 truncate"
                          title={`${apt.nomePet} - ${apt.servicoRealizar}`}
                        >
                          <div className="font-medium">{apt.nomePet}</div>
                          <div className="text-gray-600">{apt.servicoRealizar}</div>
                          {apt.origem && (
                            <div className="text-xs bg-brand-orange/20 text-brand-orange px-1 rounded mt-1">
                              {apt.origem === "tutores" ? "Tutor" : "Admin"}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-sm">Livre</div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render view diária
  const renderDayView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-brand-cyan/20">
          <h3 className="text-lg font-semibold text-brand-cyan">
            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              className="border border-brand-cyan hover:bg-brand-cyan hover:text-white bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setSelectedDate(new Date())}
              className="border border-brand-orange hover:bg-brand-orange hover:text-white px-4"
            >
              Hoje
            </Button>
            <Button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="border border-brand-cyan hover:bg-brand-cyan hover:text-white bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {workingHours.map((hour) => {
            const appointmentsForHour = getAppointmentsForHour(selectedDate, hour);
            return (
              <div
                key={hour}
                className="flex border rounded-lg bg-white/90 backdrop-blur-sm border-brand-cyan/20"
              >
                <div className="w-20 p-4 bg-brand-cyan/10 text-center font-medium text-brand-cyan">
                  {hour}:00
                </div>
                <div className="flex-1 p-4 min-h-[80px]">
                  {appointmentsForHour.length > 0 ? (
                    appointmentsForHour.map((appointment) => {
                      const ServiceIcon =
                        serviceIcons[appointment.servicoRealizar as keyof typeof serviceIcons] ||
                        Clock;
                      return (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 bg-brand-cyan/5 rounded-lg border border-brand-cyan/10 mb-2"
                        >
                          <div className="flex items-center gap-3">
                            <ServiceIcon className="h-4 w-4 text-brand-orange" />
                            <div>
                              <p className="font-medium">
                                {appointment.nomeTutor} - {appointment.nomePet}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.servicoRealizar}
                              </p>
                              {appointment.origem && (
                                <Badge className="text-xs mt-1 border border-gray-300 bg-transparent">
                                  {appointment.origem === "tutores"
                                    ? "Solicitação Tutor"
                                    : "Agendamento Admin"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{appointment.horaServico}</span>
                            <Badge className={`text-xs ${statusColors[appointment.status]}`}>
                              {appointment.status}
                            </Badge>
                            {appointment.valor > 0 && (
                              <span className="font-medium text-green-600">
                                R$ {appointment.valor.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
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
    <Card>
      <CardHeader>
        <CardTitle>Agenda</CardTitle>
        <CardDescription>
          Visualize os agendamentos confirmados e solicitações aprovadas por mês, semana ou dia.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "month" | "week" | "day")}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm rounded-lg">
            <TabsTrigger
              value="month"
              className="data-[state=active]:bg-brand-cyan data-[state=active]:text-white"
            >
              Mês
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
              Semana
            </TabsTrigger>
            <TabsTrigger
              value="day"
              className="data-[state=active]:bg-brand-yellow data-[state=active]:text-gray-800"
            >
              Dia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="month">{renderMonthView()}</TabsContent>
          <TabsContent value="week">{renderWeekView()}</TabsContent>
          <TabsContent value="day">{renderDayView()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
