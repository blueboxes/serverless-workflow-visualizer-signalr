using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using System.Threading.Tasks;
using PizzaWorkflow.Models;

namespace PizzaWorkflow
{
    public static class AddToGroupFunction
    {
        // https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-signalr-service-output?tabs=in-process&pivots=programming-language-csharp#group-management

        [FunctionName("addToGroup")]
        public static Task AddToGroup(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] Connection connection,
        [SignalR(HubName = "orders", ConnectionStringSetting = "AzureSignalRConnectionString")] IAsyncCollector<SignalRGroupAction> signalRGroupActions)
        {
            return signalRGroupActions.AddAsync(
                new SignalRGroupAction
                {
                    ConnectionId = connection.ConnectionId,
                    GroupName = connection.OrderId,
                    Action = GroupAction.Add
                });
        }
    }
}
