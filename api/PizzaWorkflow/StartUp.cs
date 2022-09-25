using System;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using PizzaWorkflow;


[assembly: FunctionsStartup(typeof(StartUp))]
namespace PizzaWorkflow
{
    public class StartUp : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            //builder.Services.AddSingleton<>();
        }
    }
}