using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Data
{
    public static class ModelBuilderExtensions
    {
        public static void ApplySnakeCaseNamingConvention(this ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                entity.SetTableName(ToSnakeCase(entity.GetTableName()));

                foreach (var property in entity.GetProperties())
                    property.SetColumnName(ToSnakeCase(property.GetColumnName()));

                foreach (var key in entity.GetKeys())
                    key.SetName(ToSnakeCase(key.GetName()));

                foreach (var foreignKey in entity.GetForeignKeys())
                    foreignKey.SetConstraintName(ToSnakeCase(foreignKey.GetConstraintName()));

                foreach (var index in entity.GetIndexes())
                    index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName()));
            }
        }

        private static string ToSnakeCase(string? name)
        {
            if (string.IsNullOrEmpty(name))
                return name ?? "";

            return string.Concat(name.Select((x, i) => i > 0 && char.IsUpper(x) ? "_" + x.ToString() : x.ToString())).ToLower();
        }
    }
} 