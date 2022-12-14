export type ITeam = {
  name: string;
  id: string;
  teamId: string;
  lang: 'en' | 'ua';
  welcomeMessage: string;
  onboardingStep: number;
  isCompletedOnboarding: boolean;
  isStartedOnboarding: boolean;
  channelId: string;
  channelName: string;
};

export type IUser = {
  id?: string;
  name?: string;
  email?: string;
  nickname: string;
  picture?: string;
};

export type ISlackUser = {
  slackId: string;
  team: ITeam;
  user: IUser;
  role: 'admin' | 'user';
};

export type IFeature = {
  id: string;
  command: string;
};

export type ITeamFeatures = {
  id: string;
  feature: IFeature;
  team: ITeam;
};

export interface IFeedback {
  from: ISlackUser;
  to: ISlackUser;
  content: string;
  required: boolean;
  anonymous?: boolean;
  showContent: boolean;
}

export interface IRequestFb {
  from: ISlackUser;
  to: ISlackUser;
  message: string;
  resolved: boolean;
  feedback: IFeedback;
}
