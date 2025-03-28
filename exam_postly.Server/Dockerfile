# Stage 1: Build the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything into the build container
COPY . . 

# Publish the project (compiles and prepares for deployment)
RUN dotnet publish -c Release -o /out

# Stage 2: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /out .

# Define the entrypoint (how Render will start the server)
ENTRYPOINT ["dotnet", "exam_postly.Server.dll"]
