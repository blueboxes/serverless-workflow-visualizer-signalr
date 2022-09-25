using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace PizzaWorkflow.Activities
{
    public abstract class MessagingBase
    {
        protected async Task PublishAsync(IAsyncCollector<SignalRMessage> signalRMessages, string orderId, string eventName, object data)
        {
            await signalRMessages.AddAsync(new SignalRMessage
            {
                //UserId = orderId,
                Target = eventName,
                Arguments = new[] { data }
            });

        }
    }
}