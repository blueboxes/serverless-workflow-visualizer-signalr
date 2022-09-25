using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using PizzaWorkflow.Models;
using System;
using System.Threading;

namespace PizzaWorkflow.Activities
{
    public class CollectOrder : MessagingBase
    {
        [FunctionName(nameof(CollectOrder))]
        public async Task Run(
            [ActivityTrigger] Order order,
            [SignalR(HubName = "orders", ConnectionStringSetting = "AzureSignalRConnectionString")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger logger)
        {
            logger.LogInformation($"Collect menu items for order {order.Id}.");
            Thread.Sleep(new Random().Next(3000, 6000));
            await base.PublishAsync(signalRMessages, order.Id, "collect-order", new WorkflowState(order.Id));
        }
    }
}