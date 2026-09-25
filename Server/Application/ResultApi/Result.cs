namespace Server.Application.ResultApi
{
    public class Result<T> : Result
    {
        public T? Value { get; set; }
        private Result(T value)
        {
            Value = value;
        }
        private Result(string errorMessage)
            :base(errorMessage)
        {
        }
        static public Result<T> Ok(T value)
        {
            return new Result<T>(value);
        }
        static new public Result<T> Fail(string errorMessage)
        {
            return new Result<T>(errorMessage);
        }
    }
    public class Result
    {
        public string? ErrorMessage{
            get;
            protected set;
        }
        public bool Success => ErrorMessage == null;
        protected Result(string errorMessage)
        {
            ErrorMessage = errorMessage;
        }
        protected Result()
        {

        }
        static public Result Ok()
        {
            return new Result();
        }
        static public Result Fail(string errorMessage)
        {
            return new Result(errorMessage);
        }
    }
}
