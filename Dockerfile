# Stage 1 - Frontend build
FROM node:20 AS frontend-builder
WORKDIR /app
COPY exam_postly.client ./exam_postly.client
WORKDIR /app/exam_postly.client
RUN npm install
RUN npm run build

# Stage 2 - Backend build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
WORKDIR /src/exam_postly.Server
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 3 - Production image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=frontend-builder /app/exam_postly.client/dist ./wwwroot
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "exam_postly.Server.dll"]
