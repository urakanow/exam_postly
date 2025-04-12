using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;


namespace exam_postly.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //string connectionString = "Host=ep-yellow-dust-a2y1d5ag-pooler.eu-central-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_uzxe7qEfiTn1";
            //string connectionString = "Host=ep-yellow-dust-a2y1d5ag-pooler.eu-central-1.aws.neon.tech;Database=exam_postly_production;Username=prod_user;Password=npg_1eiWSCGu0afy";
            string productionCors = "ProductionCorsPolicy";
            
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<ApplicationDBContext>(options => options.UseNpgsql(connectionString));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(productionCors, builder =>
                {
                    builder.WithOrigins("https://urakanow.github.io")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            if(app.Environment.IsDevelopment())
            {
                app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            }
            else
            {
                app.UseCors(productionCors);
            }

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
