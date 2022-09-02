using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ably.PizzaProcess.Activities;
using Ably.PizzaProcess.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.Logging;

namespace Ably.PizzaProcess.Orchestrators
{
    public class PizzaProcessOrchestrator
    {
        [FunctionName(nameof(PizzaProcessOrchestrator))]
        public async Task Run(
            [OrchestrationTrigger] IDurableOrchestrationContext context,
            ILogger logger)
        {
            var order = context.GetInput<Order>();

            var instructions = await context.CallActivityAsync<IEnumerable<Instructions>>(
                nameof(ReceiveOrder),
                order);


            await context.CallActivityAsync(
                    nameof(SendInstructionsToKitchen),
                    instructions);

            // Simulate the time it takes to start with the order
            await context.CreateTimer(context.CurrentUtcDateTime.AddSeconds(new Random().Next(5, 10)), CancellationToken.None);

            var preparationTasks = new List<Task>();
            foreach (var instruction in instructions)
            {
                if (instruction.MenuItem.Type == MenuItemType.Pizza)
                {
                    preparationTasks.Add(context.CallActivityAsync(
                        nameof(PreparePizza),
                        instruction));
                }
            }

            await Task.WhenAll(preparationTasks);

            // Simulate the time it takes to collect the items for the order.
            await context.CreateTimer(context.CurrentUtcDateTime.AddSeconds(new Random().Next(5, 10)), CancellationToken.None);

            await context.CallActivityAsync(
                nameof(CollectMenuItems),
                order);

            await context.CallActivityAsync(
                nameof(DeliverOrder),
                order);
        }
    }
}