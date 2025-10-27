export interface AgeDistributionStat {
  phase: string;
  emoji: string;
  color: string;
  count: number;
}

export interface AddressDistributionStat {
  address: string;
  count: number;
}

export interface RegistrationTrendStat {
  month: string;
  count: number;
}

export interface PatientStatistics {
  ageDistribution: AgeDistributionStat[];
  addressDistribution: AddressDistributionStat[];
  registrationTrend: RegistrationTrendStat[];
}
