using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;

using PizzaWorkflow.Models;
using System.Threading;
using System;

namespace PizzaWorkflow.Activities
{
    public class PreparePizza : MessagingBase
    {

        [FunctionName(nameof(PreparePizza))]
        public async Task Run(
            [ActivityTrigger] Instructions instructions,
            [SignalR(HubName = "orders", ConnectionStringSetting = "AzureSignalRConnectionString")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger logger)
        {
            logger.LogInformation($"Preparing {instructions.MenuItem.Name}.");
            Thread.Sleep(new Random().Next(5000, 10000));
            await base.PublishAsync(signalRMessages, instructions.OrderId, "prepare-pizza", new WorkflowState(instructions.OrderId));
        }
    }
}