using System.Text;
using CSVParser.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSVParser.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParserController : ControllerBase
{
    private readonly ApplicationContext _context;
    public ParserController(ApplicationContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRecords()
    {
        return Ok(await _context.Persons.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> CreateFromFile(IFormFile file)
    {
        if (file.ContentType != "text/csv" || Path.GetExtension(file.FileName).ToLower() != ".csv")
        {
            return BadRequest("Invalid file format.");
        }

        if (file.Length == 0)
        {
            return BadRequest("File is empty.");
        }

        var personList = new List<Person>();

        using var stream = file.OpenReadStream();

        using (var reader = new StreamReader(stream))
        {
            string? line = await reader.ReadLineAsync();

            while (line != null)
            {
                var fields = line.Split(';');

                if (fields.Length != typeof(Person).GetProperties().Length - 1)
                {
                    line = await reader.ReadLineAsync();
                    continue;
                }

                try
                {
                    string Name = fields[0];

                    DateOnly dateOfBirth = DateOnly.ParseExact(fields[1], "dd.MM.yyyy");

                    bool isMarried = bool.Parse(fields[2]);

                    string phoneNumber = fields[3];

                    decimal salary = decimal.Parse(fields[4]);

                    var person = new Person
                    (
                        Name,
                        dateOfBirth,
                        isMarried,
                        phoneNumber,
                        salary
                    );

                    personList.Add(person);
                }
                catch (IndexOutOfRangeException ex)
                {
                    Console.WriteLine($"Parse error: {ex.Message}");
                }
                catch (FormatException ex)
                {
                    Console.WriteLine($"Format error: {ex.Message}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }

                line = await reader.ReadLineAsync();
            }
        }

        if (personList.Count != 0)
        {
            _context.Persons.AddRange(personList);

            await _context.SaveChangesAsync();
        }

        return Ok($"File processed. {personList.Count} record added successfully");
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteRecords([FromBody] List<int> idArray)
    {
        var personsToDelete = _context.Persons.Where(p => idArray.Contains(p.Id));

        _context.RemoveRange(personsToDelete);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecord(int id, [FromBody] Person person)
    {
        var personsToUpdate = _context.Persons.FirstOrDefault(p => p.Id == id);

        if (personsToUpdate == null)
        {
            return BadRequest("Person wasn't found");
        }

        personsToUpdate.Name = person.Name;
        personsToUpdate.DateOfBirth = person.DateOfBirth;
        personsToUpdate.IsMarried = person.IsMarried;
        personsToUpdate.PhoneNumber = person.PhoneNumber;
        personsToUpdate.Salary = person.Salary;

        await _context.SaveChangesAsync();

        return Ok();
    }
}