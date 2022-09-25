import type { WorkflowState } from "./WorkflowState";

export type PizzaWorkflow = RealtimeState & {
  clientId: string;
  orderId: string;
  isWorkflowComplete: boolean;
  disableOrdering: boolean;
  orderReceivedState: WorkflowState;
  kitchenInstructionsState: WorkflowState;
  preparationState: WorkflowState;
  collectionState: WorkflowState;
  deliveryState: WorkflowState;
  deliveredState: WorkflowState;
  isOrderPlaced: boolean;
};

export type RealtimeState = {
  connection: signalR.HubConnection | undefined;
  isConnected: boolean;
  channelPrefix: string;
};
