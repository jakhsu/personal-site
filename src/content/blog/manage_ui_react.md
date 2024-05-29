---
title: Better manage UI styling with react children
excerpt: a short write-up on how to use composition to create re-usable UI components, inspired by popular UI libraries
publishDate: 'Mar 3 2023'
tags:
  - React
  - Tailwind CSS
  - Refactoring
seo:
  image:
    src: ''
    alt: ''
---

Recently, when working on a project. I came across a piece of UI code that's rather hard to read and it's a also used in a lot of different places.

```typescript jsx
<CompanyLayout alwaysShowGlobalHeader={false}>
      <div className={"flex h-full flex-col space-y-8"}>
        {breakpoints.md && <Breadcrumbs items={crumbs} />}
        {!breakpoints.md && <MobileHeader student={student} />}
        <div className={"flex flex-row justify-between"}>
          <div className={"flex flex-col space-y-8"}>
            <Profile student={student} family={family} />
          </div>
          <div className={"hidden sm:flex sm:space-x-4"}>
            <StudentActionMenu student={student} setStudent={setStudent} />
            {!student?.deletedAt && (
              <Button
                text={"Edit"}
                variant={"secondary"}
                onClick={() => studentActions.triggerEditSheet(student)}
              />
            )}
          </div>
        </div>
        {student.deletedAt && (
          <>
            <div className={"w-full"}>
              <Banner
                className={"items-center"}
                variant={"important"}
                icon={{ name: "alertCircle", color: colors.white }}
                content={
                  <div className={"flex flex-row items-center justify-between"}>
                    <span>This student has been archived</span>
                    <Button
                      variant={"tertiary"}
                      text={"Restore"}
                      className={"text-white decoration-white"}
                      onClick={() => {
                        studentActions.restore(id).then(s => {
                          setStudent(s);
                        });
                      }}
                    />
                  </div>
                }
              />
            </div>
            <div className={"flex justify-start"}>
              <button
                onClick={() => {
                  setShowDetails(!showDetails);
                }}
                className={"flex flex-row items-center space-x-2"}>
                <span className={"text-label-400 text-grey-600"}>
                  See details
                </span>
                <Icon name={"chevronDown"} color={colors.grey["600"]} />
              </button>
            </div>
          </>
        )}
        {showDetails && (
          <div className={"grid h-full grid-cols-1 gap-x-8 sm:grid-cols-3"}>
            <div className={"flex w-full flex-col space-y-8 sm:col-span-2"}>
              <PlaceholderCard />
            </div>
            <div
              className={
                "mt-8 flex w-full flex-col items-end space-y-8 sm:col-span-1 sm:mt-0"
              }>
              <div className={"w-full"}>
                <EmergencyContactCard
                  key={lastUpdated.toISOString()}
                  onUpdated={() => setLastUpdated(new Date())}
                  student={student}
                  familyId={student.familyId}
                  openContactSheet={() => {
                    contactActions.triggerCreateEmergencyContactSheet({
                      familyId: student.familyId,
                    });
                  }}
                />
              </div>
              {breakpoints.md && <NavItems student={student} family={family} />}
              <MedicalInfoCard student={student} />
              <CustomFieldsCard />
              {!breakpoints.md && (
                <NavItems student={student} family={family} />
              )}
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
```

How I approached this:

Taking inspiration from UI libraries like ShadcnUI/RadixUI, the first step is to break this big chunk of UI code into smaller, reusable components.

I also preferred to use the 'children' react prop to allow flexibility, but maintain the styling

so I added these components:

- `DetailPageLayout`: Manages the overall layout and conditional rendering based on the entity's state (e.g., archived).

<details>
<summary>code</summary>
  
```typescript jsx
export const DetailPageLayout = ({
  children,
  crumbs,
  header,
  mobileActions,
  desktopActions,
  editAction,
  restoreAction,
  archivedEntityName,
  isArchived,
}: {
  children: ReactNode;
  crumbs: BreadcrumbsProps["items"];
  isArchived: boolean;
  header: ReactNode;
  editAction?: () => void;
  restoreAction: () => void;
  archivedEntityName: string;
  mobileActions: ActionMenuProps["items"];
  desktopActions: ActionMenuProps["items"];
}) => {
  const [showContent, setShowContent] = useState(() => !isArchived);
  const breakpoints = useBreakpoint();

return (
<CompanyLayout alwaysShowGlobalHeader={false}>

<div className={"flex h-full flex-col space-y-8"}>
{breakpoints.md && <Breadcrumbs items={crumbs} />}
{!breakpoints.md && <MobileActionBar mobileActions={mobileActions} />}
<div className={"flex flex-row justify-between"}>
{header}
<div className={"hidden md:flex md:space-x-4"}>
<ActionMenu
trigger={
<Button
text={"Actions"}
role="staff-actions"
rightIcon={"chevronDown"}
variant={"secondary"}
/>
}
items={desktopActions}
/>
{!isArchived && editAction && (
<Button
text={"Edit"}
variant={"secondary"}
onClick={editAction}
/>
)}
</div>
</div>
{isArchived && (
<>
<div className={"w-full"}>
<Banner
className={"items-center"}
variant={"important"}
icon={{ name: "alertCircle", color: colors.white }}
content={
<div className={"flex flex-row items-center justify-between"}>
<span>This {archivedEntityName} has been archived</span>
<Button
variant={"tertiary"}
text={"Restore"}
className={"text-white decoration-white"}
onClick={restoreAction}
/>
</div>
}
/>
</div>
<div className={"flex justify-start"}>
<button
onClick={() => {
setShowContent(!showContent);
}}
className={"flex flex-row items-center space-x-2"}>
<span className={"text-label-400 text-grey-600"}>
See details
</span>
<Icon name={"chevronDown"} color={colors.grey["600"]} />
</button>
</div>
</>
)}
{showContent && children}
</div>
</CompanyLayout>
);
};

````

</details>

- `DetailPageGrid`: Defines a grid layout to organize the content into logical sections.

<details>
<summary>code</summary>

```typescript jsx
export const DetailPageGrid = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"grid h-full grid-cols-1 gap-x-8 md:grid-cols-3"}>
      {children}
    </div>
  );
};
````

</details>

- `DetailPageGridLeftColumn` and `DetailPageGridRightColumn`: Provide containers for content, segregating information for better visual hierarchy.

<details>
<summary>code</summary>
  
```typescript jsx
export const DetailPageGridRightColumn = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div
      className={
        "mt-8 flex w-full flex-col items-end space-y-8 md:col-span-1 md:mt-0"
      }>
      {children}
    </div>
  );
};

export const DetailPageGridLeftColumn = ({
children,
}: {
children: ReactNode;
}) => {
return (

<div className={"flex w-full flex-col space-y-8 md:col-span-2"}>
{children}
</div>
);
};

````

</details>

so with these re-usable parts, now the original code can be re-written as:

```typescript jsx
return (
    <DetailPageLayout
      archivedEntityName={"student"}
      restoreAction={() => {
        if (student) {
          studentActions.unarchive(student).then();
        }
      }}
      editAction={() => {
        if (student) {
          studentActions.showUpdateForm(student);
        }
      }}
      desktopActions={
        student.archivedAt
          ? [
              {
                title: "Restore",
                onClick: () => {
                  studentActions.unarchive(student).then();
                },
              },
              {
                title: "Delete",
                variant: "destructive",
                onClick: () => {
                  studentActions.deleteOne(student).then();
                },
              },
            ]
          : [
              {
                title: "Archive",
                onClick: () => {
                  studentActions.archive(student).then();
                },
              },
              {
                title: "Delete",
                variant: "destructive",
                onClick: () => {
                  studentActions.deleteOne(student).then();
                },
              },
            ]
      }
      mobileActions={[
        {
          title: "Edit",
          onClick: () => {
            if (student) {
              studentActions.showUpdateForm(student);
            }
          },
        },
        {
          title: "Archive",
          onClick: () => {
            if (student) {
              studentActions.archive(student).then();
            }
          },
        },
        {
          title: "Delete",
          variant: "destructive",
          onClick: () => {
            if (student) {
              studentActions.deleteOne(student).then();
            }
          },
        },
      ]}
      crumbs={[
        {
          text: "Students",
          onPress: () => {
            Router.push("StudentList");
          },
        },
        {
          text: student.firstname + " " + student.lastname,
        },
      ]}
      isArchived={student.archivedAt !== null}
      header={<Profile student={student} family={family} />}>
      <DetailPageGrid>
        <DetailPageGridLeftColumn>
          <PlaceholderCard />
        </DetailPageGridLeftColumn>
        <DetailPageGridRightColumn>
          <div className={"w-full"}>
            <EmergencyContactCard
              key={lastUpdated.toISOString()}
              onUpdated={() => setLastUpdated(new Date())}
              student={student}
              familyId={student.familyId}
              openContactSheet={() => {
                contactActions.showEmergencyContactCreateForm({
                  familyId: student.familyId,
                });
              }}
            />
          </div>
          {breakpoints.md && <NavItems student={student} family={family} />}
          <MedicalInfoCard student={student} />
          <CustomFieldResponsesCard entityId={student.id} />
          {!breakpoints.md && <NavItems student={student} family={family} />}
        </DetailPageGridRightColumn>
      </DetailPageGrid>
    </DetailPageLayout>
  );
````

a lot easier to manage and read, right?

This is basically how shadcn does it:

```typescript jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

these components all have internal styling, and when you use them this way, you don't need to think about those styling
like <CardHeader> will `flex flex-col` it's children with some specific spacing

This is also a lot easier to passing in a bunch of props.
