INSERT INTO department (name)
VALUES
    ('Retail'),
    ('Human Resources'),
    ('Finance'),
    ('IT');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Manager', 100000, 1),
    ('Sales Associate', 60000, 1),
    ('Recruiter', 85000, 2),
    ('Chief Diversity Officer', 90000, 2),
    ('Auditor', 85000, 3),
    ('Chief Financial Officer', 110000, 3),
    ('Computer Support Specialist', 100000, 4),
    ('Web Developer', 110000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Stefon', 'Diggs', 1, NULL),
    ('Gary', 'Miller', 2, 1),
    ('Sarah', 'West', 3, NULL),
    ('Pete', 'Benson', 4, 3),
    ('Javier', 'Umpo', 5, NULL),
    ('Uma', 'Roos', 6, 5),
    ('Josh', 'Allen', 7, NULL),
    ('Kyle', 'Gruschow', 8, 7);
