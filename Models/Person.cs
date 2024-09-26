namespace CSVParser.Models;

public class Person
{
    public Person(
        string name,
        DateOnly dateOfBirth,
        bool isMarried,
        string phoneNumber,
        decimal salary
    )
    {
        Name = name;
        DateOfBirth = dateOfBirth;
        IsMarried = isMarried;
        PhoneNumber = phoneNumber;
        Salary = salary;
    }

    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public bool IsMarried { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public decimal Salary { get; set; }
}