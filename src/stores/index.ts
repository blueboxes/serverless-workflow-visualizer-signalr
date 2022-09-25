import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { PizzaWorkflow } from "@/types/PizzaWorkflow";
import OrderImage from "../assets/Order.png";
import PizzaAndDrinkImage from "../assets/PizzaAndDrink.png";
import PizzaInOvenImage from "../assets/PizzaInOven.png";
import BoxAndDrinkImage from "../assets/BoxAndDrink.png";
import DeliveryImage from "../assets/Delivery.png";
import DeliveredImage from "../assets/Map.gif";
import type { Order } from "@/types/Order";
import * as signalR from "@microsoft/signalr";

export interface WorkflowState {
  orderId: string;
  messageSentTimeStampUTC: number;
}

export const pizzaProcessStore = defineStore("pizza-process", {
  state: (): PizzaWorkflow => ({
    connection: undefined,
    isConnected: false,
    channelPrefix: "pizza-process",
    clientId: "",
    orderId: "",
    disableOrdering: false,
    isWorkflowComplete: false,
    isOrderPlaced: false,
    orderReceivedState: {
      messageSentTimeStampUTC: 0,
      messageReceivedTimestamp: 0,
      messageDeliveredTimestamp: 0,
      title: "Order Received",
      orderId: "",
      image: OrderImage,
      isVisible: false,
      isDisabled: true,
      isCurrentState: false,
    },
    kitchenInstructionsState: {
      messageSentTimeStampUTC: 0,
      messageReceivedTimestamp: 0,
      messageDeliveredTimestamp: 0,
      title: "Sending instructions to the kitchen",
      orderId: "",
      image: PizzaAndDrinkImage,
      isVisible: false,
      isDisabled: true,
      isCurrentState: false,
    },
    preparationState: {
      messageSentTimeStampUTC: 0,
      messageReceivedTimestamp: 0,
      messageDeliveredTimestamp: 0,
      title: "Preparing your pizza",
      orderId: "",
      image: PizzaInOvenImage,
      isVisible: false,
      isDisabled: true,
      isCurrentState: false,
    },
    collectionState: {
      messageSentTimeStampUTC: 0,
      messageReceivedTimestamp: 0,
      messageDeliveredTimestamp: 0,
      title: "Collecting your order",
      orderId: "",
      image: BoxAndDrinkImage,
      isVisible: false,
      isDisabled: true,
      isCurrentState: false,
    },
    deliveryState: {
      messageSentTimeStampUTC: 0,
      messageReceivedTimestamp: 0,
      messageDeliveredTimestamp: 0,
      title: "Delivering your order",
      orderId: "",
      image: DeliveryImage,
      isVisible: false,
      isDisabled: true,
      isCurrentState: false,
    },
    deliveredState: {
      messageSentTimeStampUTC: 0,
      messageReceivedTimestamp: 0,
      messageDeliveredTimestamp: 0,
      title: "Order is delivered",
      orderId: "",
      image: DeliveredImage,
      isVisible: false,
      isDisabled: true,
      isCurrentState: false,
    },
  }),
  actions: {
    async start(clientId: string, order: Order) {
      this.$reset();
      this.$state.clientId = clientId;
      this.$state.orderId = order.id;
      this.$state.disableOrdering = true;
      this.$state.orderReceivedState.isVisible = true;
      await this.createRealtimeConnection(clientId, order);
    },
    async createRealtimeConnection(clientId: string, order: Order) {
      if (!this.isConnected) {
        const apiBaseUrl = `${import.meta.env.VITE_API_ROOT}/api`;
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(apiBaseUrl)
          .withAutomaticReconnect()
          .build();

        //This method is called to create the connection
        //to SignalR so the client can receive messages
        this.connection
          .start()
          .then(async () => {
            this.isConnected = true;
            this.attachToChannel(order.id, this.connection?.connectionId);
            if (!this.isOrderPlaced) {
              await this.placeOrder(order);
              this.$state.isOrderPlaced = true;
            }
          })
          .catch(function (err) {
            return console.error(err.toString());
          });

        this.connection.onclose(() => {
          this.isConnected = false;
        });
      }
    },

    disconnect() {
      this.connection?.stop();
    },

    async placeOrder(order: Order) {
      const response = await window.fetch(
        `${import.meta.env.VITE_API_ROOT}/api/startworkflow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );
      if (response.ok) {
        const payload = await response.text();
        this.$state.orderId = payload;
        console.log(`Order ID: ${this.orderId}`);
      } else {
        this.$state.disableOrdering = false;
        console.log(response.statusText);
      }
    },

    async attachToChannel(
      orderId: string,
      connectionId: string | null | undefined
    ) {
      await window.fetch(`${import.meta.env.VITE_API_ROOT}/api/addToGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: orderId, connectionId: connectionId }),
      });

      this.subscribeToMessages();
    },

    subscribeToMessages() {
      this.$state.connection?.on("receive-order", (message: WorkflowState) => {
        this.handleOrderReceived(message);
      });
      this.$state.connection?.on(
        "send-instructions-to-kitchen",
        (message: WorkflowState) => {
          this.handleSendInstructions(message);
        }
      );
      this.$state.connection?.on("prepare-pizza", (message: WorkflowState) => {
        this.handlePreparePizza(message);
      });
      this.$state.connection?.on("collect-order", (message: WorkflowState) => {
        this.handleCollectOrder(message);
      });
      this.$state.connection?.on("deliver-order", (message: WorkflowState) => {
        this.handleDeliverOrder(message);
      });
      this.$state.connection?.on(
        "delivered-order",
        (message: WorkflowState) => {
          this.handleDeliveredOrder(message);
        }
      );
    },

    handleOrderReceived(message: WorkflowState) {
      this.$patch({
        orderReceivedState: {
          orderId: message.orderId,
          messageSentTimeStampUTC: message.messageSentTimeStampUTC,
          messageReceivedTimestamp: Date.now(),
          messageDeliveredTimestamp: Date.now(),
          isDisabled: false,
          isCurrentState: true,
        },
        kitchenInstructionsState: {
          isVisible: true,
        },
      });
    },

    handleSendInstructions(message: WorkflowState) {
      this.$patch({
        kitchenInstructionsState: {
          orderId: message.orderId,
          messageSentTimeStampUTC: message.messageSentTimeStampUTC,
          messageReceivedTimestamp: Date.now(),
          messageDeliveredTimestamp: Date.now(),
          isDisabled: false,
          isCurrentState: true,
        },
        orderReceivedState: {
          isCurrentState: false,
        },
        preparationState: {
          isVisible: true,
        },
      });
    },

    handlePreparePizza(message: WorkflowState) {
      this.$patch({
        preparationState: {
          orderId: message.orderId,
          messageSentTimeStampUTC: message.messageSentTimeStampUTC,
          messageReceivedTimestamp: Date.now(),
          messageDeliveredTimestamp: Date.now(),
          isDisabled: false,
          isCurrentState: true,
        },
        kitchenInstructionsState: {
          isCurrentState: false,
        },
        collectionState: {
          isVisible: true,
        },
      });
    },

    handleCollectOrder(message: WorkflowState) {
      this.$patch({
        collectionState: {
          orderId: message.orderId,
          messageSentTimeStampUTC: message.messageSentTimeStampUTC,
          messageReceivedTimestamp: Date.now(),
          messageDeliveredTimestamp: Date.now(),
          isDisabled: false,
          isCurrentState: true,
        },
        preparationState: {
          isCurrentState: false,
        },
        deliveryState: {
          isVisible: true,
        },
      });
    },

    handleDeliverOrder(message: WorkflowState) {
      this.$patch({
        deliveryState: {
          orderId: message.orderId,
          messageSentTimeStampUTC: message.messageSentTimeStampUTC,
          messageReceivedTimestamp: Date.now(),
          messageDeliveredTimestamp: Date.now(),
          isDisabled: false,
          isCurrentState: true,
        },
        collectionState: {
          isCurrentState: false,
        },
        deliveredState: {
          isVisible: true,
        },
      });
    },

    handleDeliveredOrder(message: WorkflowState) {
      this.$patch({
        deliveredState: {
          orderId: message.orderId,
          messageSentTimeStampUTC: message.messageSentTimeStampUTC,
          messageReceivedTimestamp: Date.now(),
          messageDeliveredTimestamp: Date.now(),
          isDisabled: false,
          isCurrentState: true,
        },
        collectionState: {
          isCurrentState: false,
        },
        isWorkflowComplete: true,
      });
      setTimeout(() => {
        this.disableOrdering = false;
      }, 2000);
    },
  },
});
