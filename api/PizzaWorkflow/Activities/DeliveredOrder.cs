using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.Logging;
using PizzaWorkflow.Models;
using System.Threading;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace PizzaWorkflow.Activities
{
    public class DeliveredOrder : MessagingBase
    {
        [FunctionName(nameof(DeliveredOrder))]
        public async Task Run(
            [SignalR(HubName = "orders", ConnectionStringSetting = "AzureSignalRConnectionString")] IAsyncCollector<SignalRMessage> signalRMessages,
            [ActivityTrigger] Order order,
            ILogger logger)
        {
            logger.LogInformation($"Delivered {order.Id}.");
            Thread.Sleep(new Random().Next(3000, 6000));
            await base.PublishAsync(signalRMessages, order.Id, "delivered-order", new WorkflowState(order.Id));
        }
    }
}