export type Environment = 'development' | 'production';

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  isEnabled: boolean;
  environment: Environment;
  createdAt: Date;
  updatedAt: Date;
}

export type FlagResponse = Record<string, boolean>;
