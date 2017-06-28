FROM microsoft/dotnet:1.1-runtime
WORKDIR /app
COPY api/bin/Release/netcoreapp1.1/publish ./
#COPY node_modules/ ./node_modules
#ENV NODE_PATH="node_modules/"
EXPOSE 5000
ENTRYPOINT ["dotnet", "api.dll"]
