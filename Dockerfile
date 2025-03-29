## Stage 1 - Frontend build
#FROM node:20 AS frontend-builder
#WORKDIR /app
#COPY exam_postly.client ./exam_postly.client
#WORKDIR /app/exam_postly.client
#RUN npm install
#RUN npm run build
#
## Stage 2 - Backend build
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#WORKDIR /src
#COPY . .
#WORKDIR /src/exam_postly.Server
#RUN dotnet restore
#RUN dotnet publish -c Release -o /app/publish
#
## Stage 3 - Production image
#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
#WORKDIR /app
#COPY --from=build /app/publish .
#COPY --from=frontend-builder /app/exam_postly.client/dist ./wwwroot
#ENV ASPNETCORE_URLS=http://+:80
#ENTRYPOINT ["dotnet", "exam_postly.Server.dll"]
#

# Use the official base image for .NET SDK, starting with a clean slate
#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
#WORKDIR /app
#EXPOSE 80
#
## Set the base image for the build (to restore and build the app)
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#WORKDIR /src
#
## Install Node.js (latest LTS version) in the container
#RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    #&& apt-get install -y nodejs
#
## Install .NET SDK 8.0.402 to avoid bugs in 8.0.403
#RUN mkdir -p /dotnet-sdk \
    #&& wget https://dot.net/v1/dotnet-install.sh -O /dotnet-install.sh \
    #&& chmod +x /dotnet-install.sh \
    #&& /dotnet-install.sh --version 8.0.402 --install-dir /dotnet-sdk \
    #&& export PATH=$PATH:/dotnet-sdk
#
## Restore the project dependencies
#COPY ["exam_postly.Server/exam_postly.Server.csproj", "exam_postly.Server/"]
#COPY ["exam_postly.client/package.json", "exam_postly.client/"]
#RUN dotnet restore "exam_postly.Server/exam_postly.Server.csproj"
#
## Publish the .NET Core app
#COPY . .
#WORKDIR "/src/exam_postly.Server"
#RUN dotnet publish "exam_postly.Server.csproj" -c Release -o /app/publish
#
## Build the React app
#WORKDIR /src/exam_postly.client
#RUN npm install
#RUN npm run build
#
## Copy published files and React build to the final container
#FROM base AS final
#WORKDIR /app
#COPY --from=build /app/publish .
#COPY --from=build /src/exam_postly.client/dist /app/wwwroot
#ENTRYPOINT ["dotnet", "exam_postly.Server.dll"]


# =========================
# Stage 1 - Build React App
# =========================
FROM node:18 AS frontend

WORKDIR /app

# Install dependencies
COPY exam_postly.client/package*.json ./
RUN npm install

# Copy source code and build
COPY exam_postly.client/ .
RUN npm run build


# =================================
# Stage 2 - Build ASP.NET Core App
# =================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and restore dependencies
COPY *.sln .
COPY exam_postly.Server/ exam_postly.Server/
COPY exam_postly.client/ exam_postly.client/

WORKDIR /src/exam_postly.Server
RUN dotnet restore

# Build and publish the app
RUN dotnet publish -c Release -o /app/publish


# ===================================
# Stage 3 - Final Runtime Image
# ===================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0.3 AS final
WORKDIR /app

# Copy published .NET app
COPY --from=build /app/publish .

# Copy built frontend (React) into wwwroot
COPY --from=frontend /app/dist ./wwwroot

# Set the entry point
ENTRYPOINT ["dotnet", "exam_postly.Server.dll"]
