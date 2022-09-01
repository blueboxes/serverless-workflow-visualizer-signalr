using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Ably.PizzaProcess.Orchestrators;
using Ably.PizzaProcess.Models;

namespace Ably.PizzaProcess.Clients
{
    public static class StartWorkflow
    {
        [FunctionName(nameof(StartWorkflow))]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] Order order,
            [DurableClient] IDurableClient durableClient)
        {
            var id = await durableClient.StartNewAsync(
                nameof(PizzaProcessOrchestrator),
                order);

            return new OkObjectResult($"Start processing order {id}.");
        }
    }
}
