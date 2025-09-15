namespace CosmoCargo.Model.Exceptions
{
    public class NotFoundException : Exception
    {
        public string AggregateType { get; set; } = string.Empty;
        public string AggregateId { get; set; } = string.Empty;

        protected NotFoundException() {}
        public NotFoundException(string aggregateType, string aggregateId) : base($"{aggregateType} with id {aggregateId} not found")
        {
            AggregateType = aggregateType;
            AggregateId = aggregateId;
        }
    }
}
