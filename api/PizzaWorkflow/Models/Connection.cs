using System;
using Newtonsoft.Json;

namespace PizzaWorkflow.Models
{
    public class Connection
    {
      
        [JsonProperty("orderId")]
        public string OrderId { get; set; }

        [JsonProperty("connectionId")]
        public string ConnectionId { get; set; }
    }
}