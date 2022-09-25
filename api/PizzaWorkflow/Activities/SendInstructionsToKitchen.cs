using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.Logging;

using PizzaWorkflow.Models;
using System.Linq;
using System.Threading;
using System;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace PizzaWorkflow.Activities
{
    public class SendInstructionsToKitchen : MessagingBase
    {

        [FunctionName(nameof(SendInstructionsToKitchen))]
        public async Task Run(
            [ActivityTrigger] IEnumerable<Instructions> instructions,
            [SignalR(HubName = "orders", ConnectionStringSetting = "AzureSignalRConnectionString")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger logger)
        {
            logger.LogInformation($"Sending instructions to kitchen.");
            Thread.Sleep(new Random().Next(3000, 6000));
            var orderId = instructions.First().OrderId;
            await base.PublishAsync(signalRMessages, orderId, "send-instructions-to-kitchen", new WorkflowState(orderId));
        }
    }
}